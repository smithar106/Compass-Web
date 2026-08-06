import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import AssessmentPage from "@/app/assessment/page";
import AssessmentLayout from "@/app/assessment/layout";
import { standaloneQuestions, PROGRESS_STEPS } from "@/data/assessment-flow";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/lib/supabase", () => ({
  ensureAuthenticated: vi.fn().mockResolvedValue({ id: "test-user" }),
}));

vi.mock("@/lib/analytics", () => ({
  trackAssessmentStarted: vi.fn(),
  trackAssessmentCompleted: vi.fn(),
}));

const fetchMock = vi.fn();

function answerFor(questionIndex: number): string {
  const q = standaloneQuestions[questionIndex];
  return (q.options ?? [])[0] as string;
}

async function completeThrough(questionIndex: number, action: string) {
  for (let i = 0; i <= questionIndex; i++) {
    expect(screen.getByTestId("assessment-question-label").textContent).toContain(
      `Question ${i + 1} of ${PROGRESS_STEPS}`
    );
    fireEvent.click(screen.getByRole("button", { name: answerFor(i) }));
    const button = screen.getByRole("button", { name: new RegExp(action, "i") });
    fireEvent.click(button);
  }
}

describe("Standalone assessment flow", () => {
  beforeEach(() => {
    pushMock.mockReset();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ recommendation_id: "rec-abc", recommendations: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("should expose exactly five questions", () => {
    expect(PROGRESS_STEPS).toBe(5);
    expect(standaloneQuestions).toHaveLength(5);
  });

  it("should complete all five steps and submit on the final step", async () => {
    render(<AssessmentPage />);
    expect(await screen.findByTestId("assessment-question-label")).toBeTruthy();

    // Questions 1–4 use Continue; the fifth uses Generate Executive Recommendation.
    await completeThrough(3, "Continue");
    expect(screen.getByTestId("assessment-question-label").textContent).toContain("Question 5 of 5");
    fireEvent.click(screen.getByRole("button", { name: answerFor(4) }));
    fireEvent.click(screen.getByRole("button", { name: /generate executive recommendation/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/recommendations",
      expect.objectContaining({ method: "POST" })
    );
    expect(pushMock).toHaveBeenCalledWith("/decisions/rec-abc");
  });

  it("should update the progress label and bar as questions advance", async () => {
    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");

    expect(screen.getByTestId("assessment-question-label").textContent).toContain("Question 1 of 5");
    expect(screen.getByTestId("assessment-progress").style.width).toBe("0%");

    fireEvent.click(screen.getByRole("button", { name: answerFor(0) }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("assessment-question-label").textContent).toContain("Question 2 of 5");
    expect(screen.getByTestId("assessment-progress").style.width).toBe("25%");
  });

  it("should let the user go Back and Continue with answers preserved", async () => {
    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");

    fireEvent.click(screen.getByRole("button", { name: answerFor(0) }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByTestId("assessment-question-label").textContent).toContain("Question 2 of 5");

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByTestId("assessment-question-label").textContent).toContain("Question 1 of 5");
    // Prior selection is restored.
    expect(screen.getByRole("button", { name: answerFor(0) }).getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByTestId("assessment-question-label").textContent).toContain("Question 2 of 5");
  });

  it("should enforce a required answer before continuing", async () => {
    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect((continueButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: answerFor(0) }));
    expect((screen.getByRole("button", { name: /continue/i }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("should submit the correct recommendation profile", async () => {
    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");

    // dept → Operations; situation → sales problem; people → 4–10;
    // desired-outcome → Cost reduction; timeline → 1–3 months.
    const answers = [
      "Operations",
      "My sales team is missing inbound calls because we lack capacity",
      "4–10",
      "Cost reduction",
      "1–3 months",
    ];
    for (let i = 0; i < answers.length; i++) {
      fireEvent.click(screen.getByRole("button", { name: answers[i] }));
      fireEvent.click(
        screen.getByRole("button", {
          name: i === answers.length - 1 ? /generate executive recommendation/i : /continue/i,
        })
      );
    }

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.business_function).toBe("operations");
    expect(body.workflow).toBe("process_automation");
    expect(body.problem_statement).toContain("sales team");
    expect(body.people_involved).toBe("4–10");
    expect(body.desired_outcome).toBe("cost");
    expect(body.implementation_timeline).toBe("1–3 months");
  });

  it("should prevent duplicate submissions while generation is in progress", async () => {
    let resolveFetch: (v: unknown) => void;
    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");
    await completeThrough(3, "Continue");

    fireEvent.click(screen.getByRole("button", { name: answerFor(4) }));
    const generate = screen.getByRole("button", { name: /generate executive recommendation/i });
    fireEvent.click(generate);
    fireEvent.click(generate); // second click while in flight

    resolveFetch!({
      ok: true,
      json: async () => ({ recommendation_id: "rec-abc", recommendations: [] }),
    });

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/decisions/rec-abc"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should show an error and allow retry when submission fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Engine returned an error." }),
    });

    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");
    await completeThrough(3, "Continue");

    fireEvent.click(screen.getByRole("button", { name: answerFor(4) }));
    fireEvent.click(screen.getByRole("button", { name: /generate executive recommendation/i }));

    expect((await screen.findByRole("alert")).textContent).toContain("Engine returned an error.");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Retry succeeds and navigates.
    fireEvent.click(screen.getByRole("button", { name: /generate executive recommendation/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/decisions/rec-abc"));
  });

  it("should render independently from the public site (no marketing nav or footer)", async () => {
    render(
      <AssessmentLayout>
        <AssessmentPage />
      </AssessmentLayout>
    );
    await screen.findByTestId("assessment-question-label");

    // Standalone brand present.
    expect(screen.getByRole("link", { name: /compass home/i })).toBeTruthy();

    // No public-site navigation or footer links.
    for (const label of ["Product", "How It Works", "Evidence", "About", "Privacy Policy", "Terms of Service"]) {
      expect(screen.queryByRole("link", { name: label })).toBeNull();
    }

    // No homepage persuasion copy.
    expect(screen.queryByText(/implementation is becoming abundant/i)).toBeNull();
    expect(screen.queryByText(/start assessment/i)).toBeNull();
  });

  it("should persist answers in sessionStorage as the user progresses", async () => {
    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");

    fireEvent.click(screen.getByRole("button", { name: answerFor(0) }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    const stored = JSON.parse(sessionStorage.getItem("compass-assessment-session") ?? "{}");
    expect(stored.version).toBe("4.0.0");
    expect(stored.currentQuestion).toBe(1);
    expect(stored.answers).toEqual([{ questionId: "dept", value: answerFor(0) }]);
  });

  it("should restore an in-progress session on refresh", async () => {
    sessionStorage.setItem(
      "compass-assessment-session",
      JSON.stringify({
        version: "4.0.0",
        currentQuestion: 2,
        answers: [
          { questionId: "dept", value: answerFor(0) },
          { questionId: "situation", value: answerFor(1) },
          { questionId: "people", value: answerFor(2) },
        ],
      })
    );

    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");
    expect(screen.getByTestId("assessment-question-label").textContent).toContain("Question 3 of 5");
    // The answer for the restored question is selected.
    expect(screen.getByRole("button", { name: answerFor(2) }).getAttribute("aria-pressed")).toBe("true");
  });
});

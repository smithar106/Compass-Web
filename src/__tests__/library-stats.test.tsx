import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LibraryStats } from "@/components/home/LibraryStats";

const fetchMock = vi.fn();

function coverageResponse(headline: unknown) {
  return Promise.resolve({ ok: true, json: async () => ({ headline }) });
}

describe("LibraryStats", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders live library numbers from the coverage API", async () => {
    fetchMock.mockResolvedValue(
      coverageResponse({ organizations: 2642, industries: 796, implementations: 5135 })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LibraryStats extraCells={[{ value: "8", label: "questions · under 60 seconds" }]} />);

    expect(await screen.findByText("2,642")).toBeTruthy();
    expect(screen.getByText("796")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith("/api/coverage", expect.anything());
  });

  it("renders nothing (no fallback) when the coverage API fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    render(<LibraryStats />);

    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByText(/organizations in the evidence library/i)).toBeNull();
  });
});

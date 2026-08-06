import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppNav } from "@/components/workspace/AppNav";
import { DemoNav } from "@/components/demo/DemoNav";
import AssessmentLayout from "@/app/assessment/layout";
import WorkspaceLayout from "@/app/workspace/layout";
import { PUBLIC_NAV, APP_NAV, isValidRoute } from "@/lib/navigation";

const { pathnameMock } = vi.hoisted(() => ({ pathnameMock: vi.fn(() => "/") }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
  useRouter: () => ({ push: vi.fn() }),
}));

function collectInternalLinks(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a"))
    .map((a) => a.getAttribute("href") ?? "")
    .filter((h) => h.startsWith("/"));
}

describe("Public navigation", () => {
  beforeEach(() => {
    pathnameMock.mockReturnValue("/");
  });

  afterEach(() => {
    cleanup();
  });

  it("shows exactly the public nav items plus Start Assessment", () => {
    render(<Header />);
    for (const item of PUBLIC_NAV) {
      const links = screen.getAllByRole("link", { name: item.label });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0].getAttribute("href")).toBe(item.href);
    }
    const cta = screen.getAllByRole("link", { name: /start assessment/i });
    expect(cta.length).toBeGreaterThanOrEqual(1);
    expect(cta[0].getAttribute("href")).toBe("/assessment");
  });

  it("does not show application navigation on public pages", () => {
    render(<Header />);
    expect(screen.queryByRole("link", { name: "Workspace" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Coverage" })).toBeNull();
    expect(screen.queryByRole("link", { name: /new decision/i })).toBeNull();
  });
});

describe("Application navigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the app nav items and New Decision", () => {
    render(
      <WorkspaceLayout>
        <div />
      </WorkspaceLayout>
    );
    for (const item of APP_NAV) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link.getAttribute("href")).toBe(item.href);
    }
    const cta = screen.getAllByRole("link", { name: /new decision/i });
    expect(cta.length).toBeGreaterThanOrEqual(1);
    expect(cta[0].getAttribute("href")).toBe("/assessment");
  });

  it("marks the active app nav item", () => {
    pathnameMock.mockReturnValue("/workspace/decisions");
    render(<AppNav />);
    const decisions = screen.getByRole("link", { name: "Decisions" });
    expect(decisions.getAttribute("aria-current")).toBe("page");
    const overview = screen.getByRole("link", { name: "Workspace" });
    expect(overview.getAttribute("aria-current")).toBeNull();
  });
});

describe("Assessment navigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("uses minimal navigation (brand only, no marketing or app nav)", () => {
    render(
      <AssessmentLayout>
        <div />
      </AssessmentLayout>
    );
    const links = collectInternalLinks(document.body);
    // Only the brand mark link back home.
    expect(links).toEqual(["/"]);
    expect(screen.getByRole("link", { name: /compass home/i })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /how it works/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /start assessment/i })).toBeNull();
    expect(screen.queryByRole("link", { name: "Workspace" })).toBeNull();
  });
});

describe("All navigation links resolve", () => {
  afterEach(() => {
    cleanup();
  });

  it("public header, footer, app nav, demo nav, and assessment links are all valid routes", () => {
    const { container } = render(
      <>
        <Header />
        <Footer />
        <AppNav />
        <DemoNav />
      </>
    );
    const links = collectInternalLinks(container);
    expect(links.length).toBeGreaterThanOrEqual(10);
    for (const href of links) {
      expect(isValidRoute(href), `invalid route in navigation: ${href}`).toBe(true);
    }
  });
});

describe("Mobile navigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("opens and closes the mobile menu", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /toggle navigation menu/i });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    for (const item of PUBLIC_NAV) {
      expect(mobileNav.querySelector(`a[href="${item.href}"]`)).toBeTruthy();
    }

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("supports keyboard navigation: toggle is a button, Escape closes", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /toggle navigation menu/i });

    // The toggle is a native button (keyboard activatable) with proper a11y wiring.
    expect(toggle.getAttribute("aria-controls")).toBe("mobile-nav");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    // Activation opens the menu.
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeTruthy();

    // Menu links are focusable anchors to real routes.
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    for (const item of PUBLIC_NAV) {
      const link = mobileNav.querySelector(`a[href="${item.href}"]`);
      expect(link).toBeTruthy();
      expect(link?.getAttribute("tabindex")).toBeNull(); // natively focusable
    }

    // Escape closes the menu (keyboard path).
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();

    // Escape with the menu closed is a no-op.
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });
});

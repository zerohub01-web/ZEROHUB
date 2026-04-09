"use client";

export function CtaBlock() {
  function scrollToBooking() {
    const el = document.getElementById("book");
    if (!el) {
      window.location.href = "/book";
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <button
        type="button"
        onClick={scrollToBooking}
        className="audit-cta-desktop"
        aria-label="Get Free Automation Audit"
      >
        <span aria-hidden="true"></span> Get Free Automation Audit
      </button>

      <div className="audit-cta-mobile-wrap">
        <button
          type="button"
          onClick={scrollToBooking}
          className="audit-cta-mobile"
          aria-label="Get Free Automation Audit"
        >
          Get Free Automation Audit
        </button>
      </div>
    </>
  );
}

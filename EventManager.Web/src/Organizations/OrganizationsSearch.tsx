export function OrganizationsSearch() {
  return (
    <div className="organization-search-wrapper mt-3">
      <div className="container">
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <div className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Филтър
              </button>
            </div>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

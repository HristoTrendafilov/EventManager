import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="container my-3 p-4 bg-success-subtle">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <i className="bi bi-exclamation-triangle display-1 text-primary" />
            <h1 className="display-1 text-danger">404</h1>
            <h1 className="mb-4">Страницата не е намерена</h1>
            <p className="mb-4">
              Съжаляваме, но страницата, която търсите, не може да бъде
              намерена!
            </p>
            <Link className="btn btn-primary" to="/">
              Към началния екран
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

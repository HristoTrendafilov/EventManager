import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';

export function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>За нас</h5>
            <p>
              Ние сме екип, който се е съсредоточил върху това да направи
              обществото ни по-сплотено и работи усилено върху подобряване на
              средата ни за живот.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Бързи линкове</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={CustomRoutes.aboutUs()} className="text-white">
                  За нас
                </Link>
              </li>
              <li>
                <Link
                  to={CustomRoutes.eventsSearchBase()}
                  className="text-white"
                >
                  Събития
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Последвайте ни</h5>
            <ul className="list-unstyled">
              <li className="mb-1">
                <Link
                  to="https://facebook.com"
                  target="_blank"
                  className="text-white"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    color="lightBlue"
                    className="me-2"
                    size="lg"
                  />
                  Facebook
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="https://twitter.com"
                  target="_blank"
                  className="text-white"
                >
                  <FontAwesomeIcon
                    icon={faTwitter}
                    color="lightBlue"
                    className="me-2"
                    size="lg"
                  />
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  to="https://linkedin.com"
                  target="_blank"
                  className="text-white"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    color="lightBlue"
                    className="me-2"
                    size="lg"
                  />
                  Linkedin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>
            &copy; {new Date().getFullYear()} Aspire Technologies. Всички права
            са запазени.
          </p>
        </div>
      </div>
    </footer>
  );
}

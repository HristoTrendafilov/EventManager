import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { verifyUserEmail } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { UserVerifyEmail } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';

export function EmailVerification() {
  const [error, setError] = useState<string | undefined>();

  const { userId, token } = useParams<{ userId: string; token: string }>();

  const verifyEmail = useCallback(async () => {
    const request: UserVerifyEmail = {
      userId: Number(userId),
      emailVerificationSecret: token!,
    };

    const response = await verifyUserEmail(request);
    if (!response.success) {
      setError(response.errorMessage);
    }
  }, [token, userId]);

  useEffect(() => {
    void verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="container">
      <div className="card mw-600px m-50auto">
        <h3 className="card-header">Верификация на имейл</h3>
        <div className="card-body">
          {error ? (
            <ErrorMessage error={error} />
          ) : (
            <div>
              <p>Верификацията на имейл беше успешна.</p>
              <Link to={CustomRoutes.usersLogin()} className="btn btn-primary">
                Към страницата за вход
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

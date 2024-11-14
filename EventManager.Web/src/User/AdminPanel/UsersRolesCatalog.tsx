import { useCallback, useEffect, useState } from 'react';

import {
  getAllRoles,
  getUsersForRoles,
} from '~Infrastructure/ApiRequests/users-requests';
import {
  type RoleView,
  UserRoleFilterSchema,
  type UserRoleFilterType,
  type UserView,
} from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

import { UserRole } from './UserRole';

import './UsersRolesCatalog.css';

export function UsersRolesCatalog() {
  const [users, setUsers] = useState<UserView[]>([]);
  const [roles, setRoles] = useState<RoleView[]>([]);
  const [error, setError] = useState<string | undefined>();

  const form = useZodForm({ schema: UserRoleFilterSchema });

  const loadRoles = useCallback(async () => {
    const response = await getAllRoles();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setRoles(response.data);
  }, []);

  const handleFormSubmit = useCallback(async (filter: UserRoleFilterType) => {
    const response = await getUsersForRoles(filter);
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setUsers(response.data);
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  return (
    <div className="user-roles-wrapper">
      <div className="container">
        {error && <ErrorMessage error={error} />}
        <div className="card">
          <h4 className="card-header">Потребителски права</h4>
          <div className="card-body">
            <CustomForm form={form} onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="col-md-8">
                  <CustomInput
                    {...form.register('username')}
                    label="Потребителско име"
                  />
                </div>
                <div className="col-md-4">
                  <button type="submit" className="btn btn-primary w-100">
                    Търси
                  </button>
                </div>
              </div>
            </CustomForm>
            <hr />
            {users.length > 0 &&
              users.map((x) => (
                <UserRole key={x.userId} user={x} roles={roles} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

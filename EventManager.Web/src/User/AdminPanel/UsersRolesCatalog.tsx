import { useCallback, useEffect, useState } from 'react';

import { getAllRoles, getUsersForRoles } from '~/Infrastructure/ApiRequests/users-requests';
import { RoleFilterSchema, type RoleFilterType, type RoleView, type UserView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';

import { UserRole } from './UserRole';

export function UsersRolesCatalog() {
  const [users, setUsers] = useState<UserView[]>([]);
  const [roles, setRoles] = useState<RoleView[]>([]);
  const [error, setError] = useState<string | undefined>();

  const { form } = useZodForm({ schema: RoleFilterSchema });

  const loadRoles = useCallback(async () => {
    const response = await getAllRoles();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setRoles(response.data);
  }, []);

  const handleFormSubmit = useCallback(async (filter: RoleFilterType) => {
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
    <div className="container mw-700px mt-4">
      {error && <ErrorMessage error={error} />}
      <div className="card shadow">
        <h4 className="card-header _primary-bg-gradient-color text-white">Потребителски права</h4>
        <div className="card-body">
          <CustomForm form={form} onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col-md-8">
                <CustomInput {...form.register('username')} label="Потребителско име" required />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary w-100">
                  Търси
                </button>
              </div>
            </div>
          </CustomForm>
          <hr />
          {users.length > 0 && users.map((x) => <UserRole key={x.userId} user={x} roles={roles} />)}
        </div>
      </div>
    </div>
  );
}

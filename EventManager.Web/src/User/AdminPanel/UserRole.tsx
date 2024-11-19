import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { saveUserRoles } from '~Infrastructure/ApiRequests/users-requests';
import {
  RoleBaseFormSchema,
  type RoleBaseFormType,
  type RoleView,
  type UserView,
} from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

interface UserRoleProps {
  user: UserView;
  roles: RoleView[];
}

export function UserRole(props: UserRoleProps) {
  const { user, roles } = props;

  const [error, setError] = useState<string | undefined>();

  const form = useZodForm({
    schema: RoleBaseFormSchema,
    defaultValues: { userId: user.userId, rolesIds: user.userRolesIds || [] },
  });

  const handleFormSubmit = useCallback(
    async (userRoles: RoleBaseFormType) => {
      const response = await saveUserRoles(userRoles);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toast.success(
        `Успешно променихте правата на потребител: ${user.username}`
      );
    },
    [user.username]
  );

  const handleCheckboxChange = (roleId: number) => {
    const currentRoles = form.getValues('rolesIds') || [];

    const updatedRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((id) => id !== roleId) // Remove roleId if it exists
      : [...currentRoles, roleId]; // Add roleId if it doesn't exist

    form.setValue('rolesIds', updatedRoles);
  };

  return (
    <div className="user-role-wrapper">
      <div className="card mb-2">
        <CustomForm form={form} onSubmit={handleFormSubmit}>
          <h5 className="card-header">{user.username}</h5>
          <div className="card-body">
            <div className="d-flex flex-column">
              {roles.map((x) => (
                <div key={x.roleId} className="d-flex gap-2">
                  <input
                    id={`${user.userId}_${x.roleId}`}
                    type="checkbox"
                    checked={
                      form.watch('rolesIds')?.includes(x.roleId) || false
                    }
                    onChange={() => handleCheckboxChange(x.roleId)}
                  />
                  <label htmlFor={`${user.userId}_${x.roleId}`}>
                    {x.roleNameBg}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                Запази
              </button>
            </div>
          </div>
        </CustomForm>
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}

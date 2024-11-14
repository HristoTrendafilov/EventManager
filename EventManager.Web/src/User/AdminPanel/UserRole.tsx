import { useCallback, useId, useState } from 'react';

import { saveUserRoles } from '~Infrastructure/ApiRequests/users-requests';
import {
  type RoleView,
  UserRoleBaseFormSchema,
  type UserRoleBaseFormType,
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

  const inputId = useId();

  const form = useZodForm({
    schema: UserRoleBaseFormSchema,
    defaultValues: { userId: user.userId!, rolesIds: user.userRolesIds || [] },
  });

  const handleFormSubmit = useCallback(
    async (userRoles: UserRoleBaseFormType) => {
      const response = await saveUserRoles(userRoles);
      if (!response.success) {
        setError(response.errorMessage);
      }
    },
    []
  );

  const handleCheckboxChange = (roleId: number) => {
    // Get the current value of rolesIds
    const currentRoles = form.getValues('rolesIds') || [];

    // Update the array based on whether the roleId is already included
    const updatedRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((id) => id !== roleId) // Remove roleId if it exists
      : [...currentRoles, roleId]; // Add roleId if it doesn't exist

    // Set the updated array back to rolesIds
    form.setValue('rolesIds', updatedRoles);
  };

  return (
    <div className="user-role-wrapper">
      <div className="card mb-2">
        <h5 className="card-header">{user.username}</h5>
        <div className="card-body">
          <CustomForm form={form} onSubmit={handleFormSubmit}>
            <div className="d-flex flex-column">
              {roles.map((x) => (
                <div key={x.roleId} className="d-flex gap-2">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={
                      form.watch('rolesIds')?.includes(x.roleId) || false
                    }
                    onChange={() => handleCheckboxChange(x.roleId)}
                  />
                  <label htmlFor={inputId}>{x.roleNameBg}</label>
                </div>
              ))}
            </div>
          </CustomForm>
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Запази
            </button>
          </div>
        </div>
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}

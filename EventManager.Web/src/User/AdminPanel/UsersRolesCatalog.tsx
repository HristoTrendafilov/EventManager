import { useCallback, useEffect, useState } from 'react';

import { getAllRoles, getUserRoles, saveUserRoles } from '~/Infrastructure/ApiRequests/users-requests';
import {
  RoleBaseFormSchema,
  type RoleBaseFormType,
  type RoleView,
  type UserSearch,
  type UserView,
} from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { toastService } from '~/Infrastructure/components/ToastService';
import { UserSelect } from '~/User/UserSelect';

export function UsersRolesCatalog() {
  const [user, setUser] = useState<UserView | undefined>();
  const [roles, setRoles] = useState<RoleView[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [userSelect, setUserSelect] = useState<boolean>(false);

  const { form } = useZodForm({ schema: RoleBaseFormSchema });

  const showUserSelectModal = useCallback(() => {
    setUserSelect(true);
  }, []);

  const closeUserSelectModal = useCallback(() => {
    setUserSelect(false);
  }, []);

  const loadRoles = useCallback(async () => {
    const response = await getAllRoles();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setRoles(response.data);
  }, []);

  const handleSelectedUser = useCallback(
    async (users: UserSearch[]) => {
      const response = await getUserRoles(users[0].userId);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      const userData = response.data;
      setUser(userData);
      form.reset({ userId: userData.userId, rolesIds: userData.userRolesIds || [] });
      closeUserSelectModal();
    },
    [closeUserSelectModal, form]
  );

  const handleCheckboxChange = (roleId: number) => {
    const currentRoles = form.getValues('rolesIds') || [];

    const updatedRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((id) => id !== roleId) // Remove roleId if it exists
      : [...currentRoles, roleId]; // Add roleId if it doesn't exist

    form.setValue('rolesIds', updatedRoles);
  };

  const handleFormSubmit = useCallback(
    async (userRoles: RoleBaseFormType) => {
      const response = await saveUserRoles(userRoles);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toastService.success(`Успешно променихте правата на потребител: ${user?.username}`);
    },
    [user?.username]
  );

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  return (
    <div className="container mw-700px my-4">
      {error && <ErrorMessage error={error} />}
      <div className="card shadow">
        <div className="d-flex justify-content-between card-header _primary-bg-gradient-color text-white">
          <h4>Права</h4>
          <button type="button" className="btn btn-lime" onClick={showUserSelectModal}>
            Потребител
          </button>
        </div>
        <div className="card-body">
          {user && (
            <CustomForm form={form} onSubmit={handleFormSubmit}>
              <div className="card shadow _primary-border">
                <div className="card-header">
                  <div className="d-flex align-items-center">
                    <img
                      src={user.userProfilePictureUrl}
                      alt="profile"
                      width={45}
                      height={45}
                      className="rounded-circle"
                    />
                    <div className="d-flex flex-column ms-2">
                      <div className="fw-bold">{user.username}</div>
                      <div className="small">{user.userFullName}</div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-column">
                    {roles.map((x) => (
                      <div key={x.roleId} className="d-flex gap-2">
                        <input
                          id={`${user.userId}_${x.roleId}`}
                          type="checkbox"
                          checked={form.watch('rolesIds')?.includes(x.roleId) || false}
                          onChange={() => handleCheckboxChange(x.roleId)}
                        />
                        <label htmlFor={`${user.userId}_${x.roleId}`}>{x.roleNameBg}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary w-100">
                      Запази
                    </button>
                  </div>
                </div>
              </div>
            </CustomForm>
          )}
        </div>
      </div>
      {userSelect && (
        <UserSelect
          onClose={closeUserSelectModal}
          onSelected={handleSelectedUser}
          isSingleSelect
          alreadySelectedUsersIds={[]}
        />
      )}
    </div>
  );
}

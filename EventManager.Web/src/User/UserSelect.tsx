import { useCallback, useState } from 'react';

import { searchUsers } from '~/Infrastructure/ApiRequests/users-requests';
import { type UserSearch, UserSearchFilterSchema, type UserSearchFilterType } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { Modal } from '~/Infrastructure/components/Modal/Modal';

import './UserSelect.css';

interface UserSelectProps {
  onClose: () => void;
  onSelected: (users: UserSearch[]) => void;
  isSingleSelect?: boolean;
  alreadySelectedUsersIds?: number[] | undefined;
}

export function UserSelect(props: UserSelectProps) {
  const { onClose, onSelected, isSingleSelect, alreadySelectedUsersIds } = props;

  const [users, setUsers] = useState<UserSearch[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearch[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [selectError, setSelectError] = useState<string | undefined>();

  const { form } = useZodForm({ schema: UserSearchFilterSchema });

  const handleSubmit = useCallback(async (filter: UserSearchFilterType) => {
    setError(undefined);
    const response = await searchUsers(filter);
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setUsers(response.data);
  }, []);

  const handleUserAddClick = useCallback(
    (user: UserSearch) => {
      if (isSingleSelect) {
        setSelectedUsers([user]);
        return;
      }

      if (
        !selectedUsers.some((selectedUser) => selectedUser.userId === user.userId) &&
        !alreadySelectedUsersIds?.includes(user.userId)
      ) {
        setSelectedUsers([user, ...selectedUsers]);
      }
    },
    [alreadySelectedUsersIds, isSingleSelect, selectedUsers]
  );

  const handleUserRemoveClick = useCallback(
    (user: UserSearch) => {
      setSelectedUsers(selectedUsers.filter((x) => x.userId !== user.userId));
    },
    [selectedUsers]
  );

  const handleConfirm = useCallback(() => {
    if (selectedUsers.length === 0) {
      setSelectError('Не сте избрали потребители');
      return;
    }

    onSelected(selectedUsers);
  }, [onSelected, selectedUsers]);

  return (
    <Modal onBackdropClick={onClose}>
      <div className="container user-select-wrapper">
        <div className="mw-800px m-70auto">
          <div className="card _primary-border">
            <div className="card-header _primary-bg-gradient-color text-white d-flex justify-content-between">
              <h3>Избор на потребител</h3>
              <button type="button" className="btn btn-warning" onClick={onClose}>
                Затвори
              </button>
            </div>
            <div className="card-body users-body">
              <CustomForm form={form} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <CustomInput {...form.register('username')} label="Потребителско име" />
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-primary w-100">
                      Търси
                    </button>
                  </div>
                </div>
              </CustomForm>
              <hr />

              <div className="row g-3">
                <div className={`col-md-${isSingleSelect ? '12' : '6'}`}>
                  {error && <ErrorMessage error={error} />}
                  {users.length > 0 && (
                    <div>
                      {users.map((x) => (
                        <button
                          key={x.userId}
                          type="button"
                          className="unset-btn mt-1"
                          aria-label="select user"
                          onClick={() => handleUserAddClick(x)}
                        >
                          <div className="card">
                            <div
                              className={`card-body p-1 d-flex ${
                                selectedUsers.some((user) => user.userId === x.userId) ||
                                alreadySelectedUsersIds?.includes(x.userId)
                                  ? 'bg-success-subtle'
                                  : ''
                              }`}
                            >
                              <img
                                src={x.userProfilePictureUrl}
                                width={45}
                                height={45}
                                className="rounded-circle"
                                alt=""
                              />
                              <div className="d-flex flex-column ms-2">
                                <div className="fw-bold">{x.username}</div>
                                <div className="small">{x.userFullName}</div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {!isSingleSelect && (
                  <div className="col-md-6">
                    <h4>Избрани потребители</h4>
                    <hr className="m-2" />
                    <div className="selected-users-body">
                      {selectedUsers.length > 0 &&
                        selectedUsers.map((x) => (
                          <div key={x.userId} className="card mt-1">
                            <div className="card-body p-1 d-flex">
                              <img
                                src={x.userProfilePictureUrl}
                                width={45}
                                height={45}
                                className="rounded-circle"
                                alt=""
                              />
                              <div className="d-flex flex-column ms-2">
                                <div className="fw-bold">{x.username}</div>
                                <div className="small">{x.userFullName}</div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-danger position-absolute end-0 me-2 mt-1 px-3"
                                onClick={() => handleUserRemoveClick(x)}
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectError && <ErrorMessage error={selectError} />}

            <div className="card-footer d-flex gap-3">
              <button type="button" className="btn btn-primary w-100" onClick={handleConfirm}>
                Избор
              </button>
              <button type="button" className="btn btn-warning w-100" onClick={onClose}>
                Изход
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

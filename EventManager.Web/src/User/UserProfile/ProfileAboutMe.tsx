import type { UserView } from '~/Infrastructure/api-types';

interface ProfileAboutMeProps {
  user: UserView;
}

export function ProfileAboutMe(props: ProfileAboutMeProps) {
  const { user } = props;

  return (
    <div>
      <h4>Кратко описание</h4>
      <p className="text-muted mb-4">{user.userShortDescription}</p>
    </div>
  );
}

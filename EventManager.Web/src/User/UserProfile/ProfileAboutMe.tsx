import type { UserView } from '~/Infrastructure/api-types';

interface ProfileAboutMeProps {
  user: UserView;
}

export function ProfileAboutMe(props: ProfileAboutMeProps) {
  const { user } = props;

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h4>Локации</h4>
          <div>Помагам в:</div>
          <ul>
            {user.regionsHelping.map((x) => (
              <li key={x.regionId}>{x.regionName}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { type Params, useNavigate, useParams } from 'react-router-dom';

interface RouterProps {
  navigate: ReturnType<typeof useNavigate>;
  params: Readonly<Params<string>>;
}

export interface WithRouterProps {
  router: RouterProps;
  children: React.JSX.Element | React.JSX.Element[];
}

export function withRouter<P extends WithRouterProps>(
  Component: React.ComponentType<P>
) {
  function ComponentWithRouterProp(props: Omit<P, 'router'>) {
    const navigate = useNavigate();
    const params = useParams();

    const routerProps: RouterProps = { navigate, params };

    return <Component {...(props as P)} router={routerProps} />;
  }

  return ComponentWithRouterProp;
}

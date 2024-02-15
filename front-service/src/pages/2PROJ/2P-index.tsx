import React, { FunctionComponent, useState } from "react";
import UserModel from "../../models/user-model";

type Props = {
  currentUser: UserModel;
};

const HomePage2PROJ: FunctionComponent<Props> = ({ currentUser }) => {
  const [user, setUser] = useState<UserModel>(currentUser);

  return (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <h2 className="m0">Projects : 2PROJ</h2>
        <div className="flex-wrap g25 w80 mb15 flex-center-align"></div>
      </div>
    </div>
  );
};

export default HomePage2PROJ;

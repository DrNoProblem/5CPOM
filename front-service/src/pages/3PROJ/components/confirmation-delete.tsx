import React, { FC } from "react";

type props = {
  returnFunction: Function;
  itemTitle: string;
};

const ModalConfirmDelete: FC<props> = ({ returnFunction, itemTitle }) => {
  return (
    <div className="dark-container">
      <h2>{itemTitle}</h2>
    </div>
  );
};

export default ModalConfirmDelete;

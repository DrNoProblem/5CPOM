import React, { FC, useEffect, useState } from "react";

type props = {
  functionReturned: Function;
  itemTitle: string;
};

const ModalConfirmDelete: FC<props> = ({ functionReturned: returnFunction, itemTitle }) => {
  const [RandomNumber, setRandomNumber] = useState<string>("");
  const [InputValue, setInputValue] = useState<string>("");
  const [isNumberMatched, setIsNumberMatched] = useState<boolean>(false);

  useEffect(() => {
    setRandomNumber(Math.floor(100000 + Math.random() * 900000).toString());
  }, []);

  useEffect(() => {
    setIsNumberMatched(InputValue === RandomNumber);
  }, [InputValue]);

  return (
    <div className="dark-container flex-col modal-delete g15">
      <h2 className="red mb0">Confirm to delete : {itemTitle}</h2>
      <h1>{RandomNumber}</h1>
      <i className=" red-h absolute r0 mr20" onClick={() => returnFunction(false)}>
        close
      </i>
      <input type="text" value={InputValue} onChange={(e) => setInputValue(e.target.value)} />

      {isNumberMatched ? (
        <div className="cta cta-full-red mlauto" onClick={() => returnFunction(true)}>
          <span className="flex-center g10">
            <i className="">delete</i>
            delete
          </span>
        </div>
      ) : (
        <div className="cta cta-disable mlauto">
          <span className="flex-center g10">
            <i className="">close</i>
            delete
          </span>
        </div>
      )}
    </div>
  );
};
export default ModalConfirmDelete;

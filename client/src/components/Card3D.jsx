
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

export default function ThreeDCard({children, title}) {
  return (
    <CardContainer className="inter-var ">
      <CardBody
        className="flex flex-col items-center gap-6 bg-slate-100 relative   hover:shadow-2xl hover:shadow-emerald-500/[0.1] w-[500px] h-[400px]  border-black/[0.1] rounded-xl p-6  border  ">
        <CardItem
          translateZ="50"
          as={'p'}
          className="w-fit h-fit text-xl font-bold text-neutral-600text-center">
            {title}
        </CardItem>
        <CardItem
          as="div"
          translateZ="60"
          className="text-neutral-500 text-sm  mt-2 ">
            {children}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

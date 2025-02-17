"use client";

import Image from "next/image";
import CheckIcon from "@/constants/svg/check.svg"; // Ensure this is correctly imported
import { Button } from "@/components/ui/button"; // Ensure it's a valid component

const features = [
  `Laboris nulla`,
  `Lorem pariatur nisi`,
  `Id aute amet pariatur`,
  `Do duis sint aliquip`,
  `Consequat eiusmod`,
  `Reprehenderit`,
  `Adipisicing reprehenderit`,
];

const PricingTable = () => (
  <section className="bg-white shadow-inner pt-12">
    <div className="relative max-w-7xl mx-auto mb-24">
      <div className="overflow-hidden lg:max-w-none lg:flex">
        <div className="py-8 px-6 md:px-0 lg:flex-shrink-1">
          <h2 className="text-4xl lg:text-7xl font-bold text-gray-800 mb-12">
            Are you ready?
          </h2>
          <p className="mt-6 text-base leading-6 text-gray-500">
            Lorem id ullamco pariatur eiusmod labore qui deserunt incididunt
            deserunt nostrud. Tempor duis in adipisicing exercitation ipsum
            nostrud esse. Reprehenderit cupidatat sint est deserunt id eiusmod
            amet aliqua officia.
          </p>
          <div className="mt-8">
            <div className="flex items-center">
              <h3 className="flex-shrink-0 pr-4 text-sm leading-5 tracking-wider font-semibold uppercase text-indigo-600">
                What is included
              </h3>
              <div className="flex-1 border-t-2 border-gray-200" />
            </div>
            <ul className="mt-8 lg:grid lg:grid-cols-2">
              {features.map((feature) => (
                <li className="flex items-center lg:col-span-1" key={feature}>
                  <div className="flex-shrink-0">
                    <Image
                      src={CheckIcon}
                      alt="Check Icon"
                      width={32}
                      height={32}
                    />
                  </div>
                  <p className="text-gray-600">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-8 px-6 text-center lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
          <p className="text-lg font-medium text-gray-800">
            If you order now...
          </p>
          <div className="my-4 flex items-center justify-center text-6xl leading-none font-bold text-gray-800">
            ₹99/mo
          </div>
          <Button variant={"default"} className="mt-6">
            Contact sales
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default PricingTable;

import {useContext} from "react";
import {ServicesContext} from "@src/provider";
import Services from "@src/services";

/**
 * Хук для доступа к менеджеру сервисов
 * @return {Store|{}}
 */
export default function useServices(): Services {
  return useContext(ServicesContext) as Services;
}

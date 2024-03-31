import Dashboard from "../MainPage/Dashboard";
import Activities from "../MainPage/Activities";
import Product from "../MainPage/Product/index";
import Sales from "../MainPage/sales";
import Profile from "../MainPage/Profile/index";
import Icons from "../MainPage/icons";
import Forms from "../MainPage/forms";
import Tables from "../MainPage/tables";
import Users from "../MainPage/users";
import HomeThree from "../MainPage/Home/home3";
import HomeFoure from "../MainPage/Home/home4";
import HomeTwo from "../MainPage/Home/home2";
import IndexOne from "../MainPage/Home/home1";

export default [
  {
    path: "dashboard",
    component: Dashboard,
  },
  {
    path: "activities",
    component: Activities,
  },
  {
    path: "product",
    component: Product,
  },
  {
    path: "profile",
    component: Profile,
  },
  {
    path: "icons",
    component: Icons,
  },
  {
    path: "forms",
    component: Forms,
  },
  {
    path: "table",
    component: Tables,
  },
  {
    path: "users",
    component: Users,
  },
  {
    path: "Sales",
    component: Sales,
  },
  {
    path: "index-three",
    component: HomeThree,
  },
  {
    path: "index-four",
    component: HomeFoure,
  },
  {
    path: "index-two",
    component: HomeTwo,
  },
  {
    path: "index-one",
    component: IndexOne,
  },
];

// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import Archives from "@/components/Archives.vue";
import SignUp from "@/components/SignUp.vue";
import Login from "@/components/Login.vue";
import UserHome from "@/components/UserHome.vue";

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/archives",
    name: "Archives",
    component: Archives,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/userhome",
    name: "UserHome",
    component: UserHome,
  },
  {
    path: "/",
    redirect: "/home", // Default to home
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
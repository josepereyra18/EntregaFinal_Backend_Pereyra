import { Carts, Products, Users, Tickets } from "../dao/factory.js";

import cartsRepository from "./cartsRepository.js";
import productsRepository from "./productsRepository.js";
import usersRepository from "./userRepository.js";
import ticketsRepository from "./ticketRepoository.js";


export const cartsService = new cartsRepository(Carts);
export const productsService = new productsRepository(Products);
export const usersService = new usersRepository(Users);
export const ticketsService = new ticketsRepository(Tickets);

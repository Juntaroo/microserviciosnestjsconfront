const $BASE_REST = 'http://localhost:3000/api/v1';

export const environment = {
  production: false,
  baseRest: $BASE_REST,

  api: {
    
    auth: {
      login: `${$BASE_REST}/auth/login`,
      register: `${$BASE_REST}/auth/register`,
      perfil: `${$BASE_REST}/auth/profile`,
      refresh: `${$BASE_REST}/auth/refresh`,
    },

   
    users: `${$BASE_REST}/users`,

    
    products: {
      all: `${$BASE_REST}/products`,
      byId: (id: string | number) => `${$BASE_REST}/products/${id}`,
      create: `${$BASE_REST}/products`,
      update: (id: string | number) => `${$BASE_REST}/products/${id}`,
      delete: (id: string | number) => `${$BASE_REST}/products/${id}`,
    },

    
    carts: {
      all: `${$BASE_REST}/carts`,
      byId: (id: string | number) => `${$BASE_REST}/carts/${id}`,
      byUserId: (userId: string | number) => `${$BASE_REST}/carts/userCarts/${userId}`,
      byUserToken: `${$BASE_REST}/carts/userCartsToken`,
      create: `${$BASE_REST}/carts`,
      update: (id: string | number) => `${$BASE_REST}/carts/${id}`,
      delete: (id: string | number) => `${$BASE_REST}/carts/${id}`,
    },

    
    invoices: {
      all: `${$BASE_REST}/invoices`,
      byId: (id: string | number) => `${$BASE_REST}/invoices/${id}`,
      create: `${$BASE_REST}/invoices`,
    },
  },
};

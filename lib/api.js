// lib/api.js

const API_BASE = "https://orange-wolf-342633.hostingersite.com/api";

export const fetchCategories = () =>
  fetch(`${API_BASE}/categories.php`).then((res) => res.json());

export const fetchProductsByCategory = (categoryId) =>
  fetch(`${API_BASE}/products.php?category_id=${categoryId}`).then((res) =>
    res.json()
  );

export const fetchSingleProduct = (id) =>
  fetch(`${API_BASE}/product.php?id=${id}`).then((res) => res.json());

export async function checkout(payload) {
  const response = await fetch(`${API_BASE}/checkout.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }

  return response.json();
}

export async function login({ phone_number, password }) {
  const response = await fetch(`${API_BASE}/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ phone_number, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Login failed: status ${response.status}, message: ${errorText}`
    );
  }

  return response.json();
}

export async function register(payload) {
  const response = await fetch(`${API_BASE}/register.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || "Registration failed.");
    if (data.reset) {
      error.reset = true;
    }
    throw error;
  }

  return data;
}

export async function recoverPassword(phone_number) {
  const response = await fetch(`${API_BASE}/recover_password.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ phone_number }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Password recovery failed: status ${response.status}, message: ${errorText}`
    );
  }

  return response.json();
}

export async function resetPassword({
  phone_number,
  reset_token,
  new_password,
}) {
  const response = await fetch(`${API_BASE}/resetpassword.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ phone_number, reset_token, new_password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Password reset failed: status ${response.status}, message: ${errorText}`
    );
  }

  return response.json();
}

export async function fetchUserPoints(user_id) {
  const response = await fetch(
    `${API_BASE}/user_points.php?user_id=${user_id}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch points: ${errorText}`);
  }

  return response.json();
}

export async function fetchUserOrders(user_id) {
  const response = await fetch(
    `${API_BASE}/user_orders.php?user_id=${user_id}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch orders: ${errorText}`);
  }

  return response.json();
}

export async function fetchDeliverySlots(deliveryMethod) {
  const response = await fetch(`${API_BASE}/delivery_slots.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ delivery_method: deliveryMethod }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch delivery slots: ${errorText}`);
  }

  return response.json();
}

export async function fetchPromos(displayIn = 1) {
  const response = await fetch(
    `${API_BASE}/promos.php?display_in=${displayIn}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch promos: ${errorText}`);
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error(`API error: ${data.message}`);
  }

  return data.data;
}

export async function searchProducts(query) {
  const response = await fetch(
    `${API_BASE}/live_search.php?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Search failed: ${errorText}`);
  }

  return response.json();
}

export const fetchAllCategories = () =>
  fetch(`${API_BASE}/allcategories.php`).then((res) => res.json());

export const fetchCategoryById = (categoryId) =>
  fetch(`${API_BASE}/categories.php?category_id=${categoryId}`).then((res) =>
    res.json()
  );

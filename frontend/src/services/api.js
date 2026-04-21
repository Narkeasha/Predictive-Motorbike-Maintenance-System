// base url for backedn api
const API_BASE = "http://127.0.0.1:8001/predict";


// --------------------engine oil ------------------------.
export async function predictEngineOil(data) {
  //sends post request to backend 
  const res = await fetch(`${API_BASE}/engine-oil`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  //if request fails
  if (!res.ok) {
    throw new Error("Engine oil prediction failed");
  }

  //return response from backend
  return res.json();
}

// --------------------tyre ------------------------.
export async function predictTyre(data) {
  const res = await fetch(`${API_BASE}/tyre`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  //if request fails 
  if (!res.ok) {
    throw new Error("Tyre prediction failed");
  }

  //return response from backed
  return res.json();
}




// --------------------brakes ------------------------.
export async function predictBrakes(data) {
  const res = await fetch(`${API_BASE}/brakes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  //if request fails 
  if (!res.ok) {
    throw new Error("Brake prediction failed");
  }

  //return response from backend
  return res.json();
}




// -------------------chain ------------------------.
export async function predictChain(data) {
  const res = await fetch(`${API_BASE}/chain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Chain prediction failed");
  }

  return res.json();
}




// --------------------brak fluid------------------------.
export async function predictBrakeFluid(data) {
  const res = await fetch(`${API_BASE}/brake-fluid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  //backend sends details for erorr.
  if (!res.ok) {
    throw new Error(result?.detail ? JSON.stringify(result.detail) : "Brake fluid prediction failed");
  }

  return result;
}


// --------------------coolant------------------------.
export async function predictCoolant(data) {
  const res = await fetch(`${API_BASE}/coolant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result?.detail ? JSON.stringify(result.detail) : "Coolant prediction failed"
    );
  }

  return result;
}
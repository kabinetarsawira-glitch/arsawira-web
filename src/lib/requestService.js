import { hasSupabase, supabase } from "./supabase";

function generateRequestCode() {

  const raw = crypto
    .randomUUID()
    .replaceAll("-", "")
    .toUpperCase();

  return `ARS-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}


function saveLocalRequest(payload) {

  const existing = JSON.parse(
    localStorage.getItem("arsawira-requests") || "[]"
  );

  const requestCode = generateRequestCode();

  const record = {

    id: requestCode,

    request_code: requestCode,

    ...payload,

    status: "Waiting",

    created_at: new Date().toISOString(),

  };


  localStorage.setItem(

    "arsawira-requests",

    JSON.stringify([
      record,
      ...existing
    ])

  );


  return record;

}


export async function createRequest(payload) {

  if (!hasSupabase) {

    return saveLocalRequest(payload);

  }


  const requestCode =
    generateRequestCode();


  const requestData = {

    ...payload,

    request_code: requestCode,

  };


  const { error } = await supabase

    .from("design_requests")

    .insert(requestData);


  if (error) {

    throw error;

  }


  return {

    id: requestCode,

    request_code: requestCode,

    ...requestData,

    status: "Waiting",

  };

}
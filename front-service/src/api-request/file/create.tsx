async function AddMedia(file : File) {
  var data: any = "";

  const body = new FormData();
  body.append("files", file);
  try {
    const response = await fetch(`http://localhost:4200/upload`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = { response: await response.json(), status: response.status };
  } catch {
    return false;
  }
  return data;
}
export default AddMedia;

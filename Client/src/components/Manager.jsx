import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";

const Manager = () => {
  const ref = useRef();
  const passwordref = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "",id: ""});
  const [passwordarray, setpasswordarray] = useState([]);

  const getPasswords = async () => {
    try {
      let req = await fetch("http://localhost:3000/");
      let passwords = await req.json();
      setpasswordarray(passwords);
    } catch (error) {
      toast.error("Error fetching passwords.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    const visibleIcon = "/on_eye_preview_see_seen_view_icon.png";
    const hiddenIcon = "/off_eye_off_icon.png";

    if (ref.current.src.endsWith(visibleIcon)) {
      ref.current.src = hiddenIcon;
      passwordref.current.type = "password";
    } else {
      ref.current.src = visibleIcon;
      passwordref.current.type = "text";
    }
  };

  const savePassword = async () => {
    try {
      await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })
      const newEntry = { ...form, id: uuidv4() };
      setpasswordarray([...passwordarray, newEntry]);
      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      setForm({ site: "", username: "", password: "" });
      toast.success("Password saved successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    } catch (error) {
      toast.error("Error saving password.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
  };

  const copytext = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      position: "top-right",
      autoClose: 5000,
      theme: "light",
    });
  };

  const deletePassword = async (id) => {
    const confirmDelete = confirm(
      "Do you really want to delete this password?"
    );
    if (confirmDelete) {
      try {
        setpasswordarray(passwordarray.filter((item) => item.id !== id));
        await fetch("http://localhost:3000/", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        toast.success("Password deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
      } catch (error) {
        toast.error("Error deleting password.", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
      }
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordarray.find((item) => item.id === id);
    setForm(passwordToEdit);
    setpasswordarray(passwordarray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        theme="light"
      />
      <br />

      <div className="p-3 md:mycontainer bg-slate-900">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-700">&lt;</span>
          <span className="text-slate-100">Pass</span>
          <span className="text-green-700">Man / &gt;</span>
        </h1>

        <p className="text-green-800 text-center text-lg">
          Your Personal Password Manager
        </p>

        <div className="flex flex-col p-4 gap-5 text-black items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
            id="site"
          />

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
              id="username"
            />

            <div className="relative flex flex-col md:flex-row items-center">
              <input
                ref={passwordref}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="absolute right-0 mx-3 cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  width="20"
                  height="25"
                  src="/off_eye_off_icon.png"
                  alt="visible--v1"
                />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center font-bold items-center w-fit rounded-full text-black bg-green-500 hover:bg-green-600 gap-2 px-5"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            <span className="px-4">Add Password</span>
          </button>
        </div>

        <div className="passwords bg-slate-900">
          <h2 className="text-white font-bold text-xl mb-2">Your Passwords</h2>

          {passwordarray.length === 0 && (
            <div className="text-white">No Passwords to show!</div>
          )}

          {passwordarray.length !== 0 && (
            <table className="table-auto border-spacing-4 w-full text-white rounded-md overflow-hidden">
              <thead className="bg-green-900">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-800">
                {passwordarray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 text-center cursor-pointer">
                        <div className="flex justify-center gap-2 items-center">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <button onClick={() => copytext(item.site)}>
                            <img
                              className="w-5"
                              src="src/icons/copy.png"
                              alt=""
                            />
                          </button>
                        </div>
                      </td>

                      <td className="py-2 text-center cursor-pointer">
                        <div className="flex justify-center gap-2 items-center">
                          {item.username}
                          <button onClick={() => copytext(item.username)}>
                            <img
                              className="w-5"
                              src="src/icons/copy.png"
                              alt=""
                            />
                          </button>
                        </div>
                      </td>

                      <td className="py-2 text-center cursor-pointer">
                        <div className="flex justify-center gap-2 items-center">
                          {item.password}
                          <button onClick={() => copytext(item.password)}>
                            <img
                              className="w-5"
                              src="src/icons/copy.png"
                              alt=""
                            />
                          </button>
                        </div>
                      </td>

                      <td className="py-2 text-center cursor-pointer">
                        <span>
                          <button
                            className="cursor-pointer mr-3"
                            onClick={() => {
                              editPassword(item.id);
                            }}
                          >
                            <img
                              className="w-5"
                              src="src/icons/edit.png"
                              alt=""
                            />
                          </button>
                        </span>
                        <span>
                          <button
                            className="cursor-pointer"
                            onClick={() => {
                              deletePassword(item.id);
                            }}
                          >
                            <img
                              className="w-5"
                              src="src/icons/delete.png"
                              alt=""
                            />
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;

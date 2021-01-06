import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess, logErr }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const { data } = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(data);
      }
      return data;
    } catch (err) {
      setErrors(err.response && err.response.data && err.response.data.errors);
    }
  };

  return { doRequest, errors };
};

export default useRequest;

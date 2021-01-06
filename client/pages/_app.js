import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async ({ ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/currentuser");

  return {
    ...data,
  };
};

export default AppComponent;

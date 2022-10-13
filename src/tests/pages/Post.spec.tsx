import { render, screen } from "@testing-library/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";



import { getSession } from "next-auth/react";
jest.mock("next-auth/react");

import { getPrismicClient } from "../../services/prismic";
jest.mock("../../services/prismic", () => {
  return {
    getPrismicClient: jest.fn().mockReturnValue({
      getByUID: jest.fn(),
    }),
  };
});

/*jest.mock("next-auth/react", () => {
  return {
    getSession() {
      return {
        activeSubscription: "active",
        expires: "expire",
      };
    },
  };
});*/

const post = {
  slug: "fake-uid",
  title: "fake-title",
  content: "fake-ontent",
  updatedAt: "2022-01-01",
};

describe("Page Post", () => {
  it("Renders correctly", () => {
    render(<Post post={post} />);
    expect(screen.getByText("fake-title")).toBeInTheDocument();
  });

  //---------------------------------------------------------------

 it("Redirect to home page when haven't active session", async () => {
    
    // Mock getSession() 
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: false,
      expires: "expired",
    });

    const props = await getServerSideProps({params: { slug: "fake-uid" }} as any)

    expect(props).toEqual(
      expect.objectContaining({
        redirect: {
          destination: "/",
          permanent: false,
        },
      })
    )

  });

  //-----------------------------------------------------------------

  it("Load post data", async () => {
    
    // Mock getSession() 
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "active",
      expires: "expire",
    });

    // Mock getByUID() 
    const prismicMocked = getPrismicClient();
    const getByUIDMocked = jest.mocked(prismicMocked.getByUID);
    getByUIDMocked.mockResolvedValueOnce({
      last_publication_date: "2022-01-01",
      data: {
        title: [{ type: "fake-type ", text: "fake-title" }],
        content: [{ type: "paragraph ", text: "fake-content" }],
      },
    } as any);

    const props = await getServerSideProps({
      params: { slug: "fake-uid" },
    } as any);

    expect(props).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "fake-uid",
            title: "fake-title",
            content: "",
            updatedAt: "31 de dezembro de 2021",
          },
        },
      })
    );
  });
});

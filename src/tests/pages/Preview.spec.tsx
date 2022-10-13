import { render, screen } from "@testing-library/react";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";

import { useSession } from "next-auth/react";
jest.mock("next-auth/react");

import { useRouter } from "next/router";
jest.mock("next/router", () => {
  return {
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  };
});

import { getPrismicClient } from "../../services/prismic";
jest.mock("../../services/prismic");

const post = {
  slug: "fake-uid",
  title: "fake-title",
  content: "fake-content",
  updatedAt: "2022-01-01",
};

describe("Page Post Preview", () => {
  it("Renders correctly", () => {
    // Mock useSession()
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    });

    render(<PostPreview post={post} />);
    expect(screen.getByText("fake-title")).toBeInTheDocument();
  });

  it("Redirects to full post page", () => {
    //Mock useSession()
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      activeSubscription: true,
    } as any);

    //Mock useRouter
    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = useRouterMocked;

    render(<PostPreview post={post} />);
    expect(pushMocked).toHaveBeenCalled();
  });

  it("Load post preview", async () => {
    
    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        last_publication_date: "2022-01-01",
        data: {
          title: [{ type: "fake-type ", text: "fake-title" }],
          content: [{ type: "paragraph ", text: "fake-content" }],
        },
      }),
    } as any);

    const props = await getStaticProps({ params: { slug: "fake-uid" } });

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

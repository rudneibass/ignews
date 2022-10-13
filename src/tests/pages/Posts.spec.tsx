import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic", () => {
  return {
    getPrismicClient: jest.fn().mockReturnValue({
      query: jest.fn(),
    }),
  };
});

describe("Page Posts", () => {
  it("Renders correctly", () => {
    render(
      <Posts
        posts={[
          {
            slug: "fake-slug",
            title: "fake-title",
            excerpt: "fake-excerpt",
            updatedAt: "fake-updatedAt",
          },
        ]}
      />
    );

    expect(screen.getByText("fake-excerpt")).toBeInTheDocument();
  });

  it("Loads initial data", async () => {
    const prismic = getPrismicClient();
    const queryPrimiscMocked = jest.mocked(prismic.query);

    queryPrimiscMocked.mockResolvedValueOnce({
      results: [
        {
          uid: "fake-uid",
          last_publication_date: "2022-01-01",
          data: {
            title: [
              {
                type: "fake-title-type",
                text: "fake-title-text",
              },
            ],

            content: [
              {
                type: "fake-content-type",
                text: "fake-content-text",
              },
            ],
          },
        },
      ],
    } as any);

    
    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "fake-uid",
              title: "fake-title-text",
              excerpt: "",
              updatedAt: "31 de dez. de 2021",
            },
          ],
        }
      })
    );
  });
});

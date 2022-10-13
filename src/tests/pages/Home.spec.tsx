import { render, screen } from "@testing-library/react";
import Home  from "../../pages";
import { getStaticProps } from "../../pages";


import stripe from "../../services/stripe";


jest.mock("../../services/stripe");

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        data: null,
        status: "authenticated",
      };
    },
  };
});

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("Page Home ", () => {
  it("Renders correctly", () => {
    render(<Home product={{ priceId: "1", amount: "10" }} />);
    expect(screen.getByAltText("Girl coding")).toBeInTheDocument();
  });

  it("Loads initial data", async () => {
    
    const retrievePriceStripeMocked = jest.mocked(stripe.prices.retrieve);
    retrievePriceStripeMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({})
    
    expect(response).toEqual(
      expect.objectContaining({
        props: { 
          product: { 
            priceId: 'fake-price-id', 
            amount: '$10.00' 
          } 
        },
      })
    )
    
  });
});

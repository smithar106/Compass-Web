import type { RailwayConfig } from "@railway/railway";

const config: RailwayConfig = {
  project: "aaffb21f-cce3-42ee-996b-6c4f9b51019b",
  environments: [
    {
      id: "production",
      resources: [
        {
          id: "166cd9f8-4e6d-4465-93d6-aaef9de0ed0a",
          type: "service",
        }
      ]
    }
  ],
};

export default config;

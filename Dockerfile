# Use Node.js LTS version as base image
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    git \
    make \
    jq \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Venn CLI globally
RUN npm install -g @vennbuild/cli

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VENN_NODE_URL=https://signer2.testnet.venn.build/api/17000/sign

# Create a non-root user with specific UID
RUN useradd -m -u 1001 venn && \
    chown -R venn:venn /app

USER venn

CMD ["/bin/bash"]

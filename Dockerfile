FROM node:24-alpine3.22

WORKDIR /myapp
COPY . .
RUN npm install
RUN cd frontend && npx rsbuild build && cd ../
EXPOSE 8080
CMD ["npm", "start"]
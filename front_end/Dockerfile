FROM next_gs_tools:1.0.0

WORKDIR /home/app

COPY . .

RUN npm run build

EXPOSE 3000

#ENTRYPOINT ["npm", "run", "start:node"]
CMD ["npm", "start"]
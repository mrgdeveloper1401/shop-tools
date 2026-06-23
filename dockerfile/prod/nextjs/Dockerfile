FROM next_gs_tools:2.0.0

WORKDIR /home/app

COPY ./GS-Tools .

RUN npm run build

EXPOSE 3000

#ENTRYPOINT ["npm", "run", "start:node"]
ENTRYPOINT ["npm", "run", "start"]
#CMD ["npm", "run", "start"]
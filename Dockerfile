FROM nginx:latest

# Copy all project files to nginx default folder
COPY . /usr/share/nginx/html

# Expose port
EXPOSE 80
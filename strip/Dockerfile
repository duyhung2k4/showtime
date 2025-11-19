FROM alpine:3.20

# Cài package cần thiết
RUN apk add --no-cache curl tar

# Set phiên bản Stripe CLI
ENV STRIPE_VERSION=1.32.0
ENV STRIPE_FILE=stripe_${STRIPE_VERSION}_linux_x86_64.tar.gz

# Tạo thư mục làm việc
WORKDIR /stripe

# Download file từ Stripe
RUN curl -L -o ${STRIPE_FILE} https://github.com/stripe/stripe-cli/releases/download/v${STRIPE_VERSION}/${STRIPE_FILE}

# Giải nén và xóa file tar
RUN tar -xzf ${STRIPE_FILE} && rm ${STRIPE_FILE}

# Thêm stripe vào PATH
ENV PATH="/stripe:${PATH}"

# Expose port để forward
EXPOSE 8000

# Lệnh chạy khi container start
CMD ["sh", "-c", "stripe listen --api-key $STRIPE_API_KEY --forward-to http://payment-api:8000/payment/webhook"]

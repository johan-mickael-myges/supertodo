[https://github.com/grpc/grpc-web](https://github.com/grpc/grpc-web)

protoc   --proto_path=./src/infrastructure/interfaces/grpc/proto/   --js_out=import_style=commonjs:./src/infrastructure/web/app/generated/ --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src/infrastructure/web/app/generated/ todo.proto

sudo kill -9 `sudo lsof -t -i:9001`
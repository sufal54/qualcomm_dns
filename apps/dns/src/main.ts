import { NestFactory } from "@nestjs/core";
import { DnsModule } from "./dns.module";

async function bootstrap() {
  const app = await NestFactory.create(DnsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

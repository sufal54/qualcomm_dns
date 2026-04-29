import { Module } from "@nestjs/common";
import { DnsAnalyticsModule } from "./dns-analytics/dns-analytics.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DnsAdminModule } from "./dns-admin/dns-admin.module";
import { ModelModule } from "./model/model.module";
import { DnsRecordModule } from "./dns-record/dns-record.module";
import { DnsManagementController } from "./dns-management.controller";
import { DnsManagementService } from "./dns-management.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'out'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.local"
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGO_URL"),
      }),
    }),
    DnsAnalyticsModule,
    DnsAdminModule,
    DnsRecordModule,
    ModelModule,
    AuthModule
  ],
  // controllers: [DnsManagementController],
  // providers: [DnsManagementService],
})
export class DnsManagementModule { }

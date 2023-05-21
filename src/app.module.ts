import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ConfigModule } from '@nestjs/config';

function handleAuth({ req }) {
  console.log(req.headers);
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: handleAuth,
        status400ForVariableCoercionErrors: false,
      },
      gateway: {
        debug: true,
        serviceHealthCheck: true,
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'stock_cards', url: process.env.SUB_GRAPH_STOCK },
          ],
        }),
      },
    }),
  ],
})
export class AppModule {}

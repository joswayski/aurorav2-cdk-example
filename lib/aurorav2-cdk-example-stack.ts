import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";

// https://github.com/aws/aws-cdk/issues/20197#issuecomment-1360639346

export class Aurorav2CdkExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new rds.DatabaseCluster(this, "Database", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_14_3,
      }),
      instanceProps: {
        vpc: new ec2.Vpc(this, "vpc-aurora-test"),
        instanceType: "serverless" as unknown as ec2.InstanceType,
      },
    });
    // Edit the generated cloudformation construct directly:
    (
      database.node.findChild("Resource") as rds.CfnDBCluster
    ).serverlessV2ScalingConfiguration = {
      minCapacity: 1,
      maxCapacity: 2,
    };
  }
}

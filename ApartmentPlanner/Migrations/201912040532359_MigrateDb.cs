namespace ApartmentPlanner.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigrateDb : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FurnitureItemModels",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ImgSrc = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.FurnitureItemModels");
        }
    }
}

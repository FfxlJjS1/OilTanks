using System;
using System.Collections.Generic;
using BackendOfSite.EFDbCistern;
using Microsoft.EntityFrameworkCore;

namespace BackendOfSite;

public partial class DbCisternContext : DbContext
{
    public DbCisternContext()
    {
        // Database.EnsureCreated();
    }

    public DbCisternContext(DbContextOptions<DbCisternContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cistern> Cisterns { get; set; }

    public virtual DbSet<CisternEquipment> CisternEquipments { get; set; }

    public virtual DbSet<Debet> Debets { get; set; }

    public virtual DbSet<Equipment> Equipment { get; set; }

    public virtual DbSet<Guide> Guides { get; set; }

    public virtual DbSet<OilProduct> OilProducts { get; set; }

    public virtual DbSet<Skw> Skws { get; set; }

    public virtual DbSet<StandartSludge> StandartSludges { get; set; }

    public virtual DbSet<Tovp> Tovps { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=db_cistern;Username=postgres;Password=1111");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cistern>(entity =>
        {
            entity.HasKey(e => e.CisternId).HasName("cistern_pk");

            entity.ToTable("cistern", tb => tb.HasComment("Таблица Резервуары"));

            entity.Property(e => e.CisternId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("cistern_id");
            entity.Property(e => e.AccessoriesKg)
                .HasComment("Комплектующие конструкции масса, кг")
                .HasColumnName("accessories_kg");
            entity.Property(e => e.BottomCentreMm)
                .HasComment("Днище Толщина центральной части, мм")
                .HasColumnName("bottom_centre_mm");
            entity.Property(e => e.BottomEdgeMm)
                .HasComment("Днище Толщина окраек, мм")
                .HasColumnName("bottom_edge_mm");
            entity.Property(e => e.BottomEdgeUnit)
                .HasComment("Днище Количество окраек, шт")
                .HasColumnName("bottom_edge_unit");
            entity.Property(e => e.BottomMarginRustMm)
                .HasComment("Днище Припуск на коррозию, мм")
                .HasColumnName("bottom_margin_rust_mm");
            entity.Property(e => e.BottomProductionGId)
                .HasComment("Днище Метод изготовления")
                .HasColumnName("bottom_production_g_id");
            entity.Property(e => e.BottomSlopeGId)
                .HasComment("Днище Тип уклона")
                .HasColumnName("bottom_slope_g_id");
            entity.Property(e => e.BottomWeightKg)
                .HasComment("Днище масса, кг")
                .HasColumnName("bottom_weight_kg");
            entity.Property(e => e.CarcassPackKg)
                .HasComment("Каркасы и упаковка масса, кг")
                .HasColumnName("carcass_pack_kg");
            entity.Property(e => e.ClassDanger)
                .HasComment("Класс опасности")
                .HasColumnName("class_danger");
            entity.Property(e => e.HatchPipeKg)
                .HasComment("Люки и патрубки масса, кг")
                .HasColumnName("hatch_pipe_kg");
            entity.Property(e => e.HeightFillingMm)
                .HasComment("Высота налива, мм")
                .HasColumnType("character varying")
                .HasColumnName("height_filling_mm");
            entity.Property(e => e.LadderConstructionGId)
                .HasComment("Лестница Тип конструкции")
                .HasColumnName("ladder_construction_g_id");
            entity.Property(e => e.LadderWeightKg)
                .HasComment("Лестница масса, кг")
                .HasColumnName("ladder_weight_kg");
            entity.Property(e => e.NominalVolumeM3)
                .HasComment("Номинальный объем, м3")
                .HasColumnName("nominal_volume_m3");
            entity.Property(e => e.RoofBeamUnit)
                .HasComment("Крыша Количество балок, шт")
                .HasColumnName("roof_beam_unit");
            entity.Property(e => e.RoofBearingElement)
                .HasMaxLength(10)
                .HasComment("Крыша Несущий элемент")
                .HasColumnName("roof_bearing_element");
            entity.Property(e => e.RoofFlooringMm)
                .HasComment("Крыша Толщина настила, мм")
                .HasColumnName("roof_flooring_mm");
            entity.Property(e => e.RoofMarginRustMm)
                .HasComment("Крыша Припуск на коррозию, мм")
                .HasColumnName("roof_margin_rust_mm");
            entity.Property(e => e.RoofPlatformKg)
                .HasComment("Площадки на крыше масса, кг")
                .HasColumnName("roof_platform_kg");
            entity.Property(e => e.RoofStConstructionGId)
                .HasComment("Стационарная крыша Тип конструкции")
                .HasColumnName("roof_st_construction_g_id");
            entity.Property(e => e.RoofStFormGId)
                .HasComment("Стационарная крыша Вид формы")
                .HasColumnName("roof_st_form_g_id");
            entity.Property(e => e.RoofWeightKg)
                .HasComment("Крыша масса, кг")
                .HasColumnName("roof_weight_kg");
            entity.Property(e => e.WallBeltUnit)
                .HasComment("Стенка количество поясов, шт")
                .HasColumnName("wall_belt_unit");
            entity.Property(e => e.WallHeightMm)
                .HasComment("Высота стенки, мм")
                .HasColumnName("wall_height_mm");
            entity.Property(e => e.WallInnerDrMm)
                .HasComment("Внутренний диаметр стенки, мм")
                .HasColumnName("wall_inner_dr_mm");
            entity.Property(e => e.WallLowerBeltMm)
                .HasComment("Стенка толщина нижнего пояса, мм")
                .HasColumnName("wall_lower_belt_mm");
            entity.Property(e => e.WallMarginRustMm)
                .HasComment("Стенка припуск коррозия, мм")
                .HasColumnName("wall_margin_rust_mm");
            entity.Property(e => e.WallProductionGId)
                .HasComment("Стенка Метод изготовления ")
                .HasColumnName("wall_production_g_id");
            entity.Property(e => e.WallUpperBeltMm)
                .HasComment("Стенка толщина верхнего пояса, мм")
                .HasColumnName("wall_upper_belt_mm");
            entity.Property(e => e.WallWeightKg)
                .HasComment("Стенка масса, кг")
                .HasColumnName("wall_weight_kg");
            entity.Property(e => e.WorkingLifeYear)
                .HasComment("Срок службы, лет")
                .HasColumnName("working_life_year");

            entity.HasOne(d => d.BottomProductionG).WithMany(p => p.CisternBottomProductionGs)
                .HasForeignKey(d => d.BottomProductionGId)
                .HasConstraintName("cistern_fk_1");

            entity.HasOne(d => d.BottomSlopeG).WithMany(p => p.CisternBottomSlopeGs)
                .HasForeignKey(d => d.BottomSlopeGId)
                .HasConstraintName("cistern_fk_2");

            entity.HasOne(d => d.LadderConstructionG).WithMany(p => p.CisternLadderConstructionGs)
                .HasForeignKey(d => d.LadderConstructionGId)
                .HasConstraintName("cistern_fk_5");

            entity.HasOne(d => d.RoofStConstructionG).WithMany(p => p.CisternRoofStConstructionGs)
                .HasForeignKey(d => d.RoofStConstructionGId)
                .HasConstraintName("cistern_fk_4");

            entity.HasOne(d => d.RoofStFormG).WithMany(p => p.CisternRoofStFormGs)
                .HasForeignKey(d => d.RoofStFormGId)
                .HasConstraintName("cistern_fk_3");

            entity.HasOne(d => d.WallProductionG).WithMany(p => p.CisternWallProductionGs)
                .HasForeignKey(d => d.WallProductionGId)
                .HasConstraintName("cistern_fk");
        });

        modelBuilder.Entity<CisternEquipment>(entity =>
        {
            entity.HasKey(e => e.CisternEquipmentId).HasName("cistern_equipment_pk");

            entity.ToTable("cistern_equipment", tb => tb.HasComment("Таблица, которая связывает Таблицу Резервуар и Таблицу Оборудование"));

            entity.Property(e => e.CisternEquipmentId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("cistern_equipment_id");
            entity.Property(e => e.CisternId).HasColumnName("cistern_id");
            entity.Property(e => e.EquipmentId).HasColumnName("equipment_id");
            entity.Property(e => e.MaxCount).HasColumnName("max_count");
            entity.Property(e => e.MinCount).HasColumnName("min_count");

            entity.HasOne(d => d.Cistern).WithMany(p => p.CisternEquipments)
                .HasForeignKey(d => d.CisternId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cistern_equipment_fk");

            entity.HasOne(d => d.Equipment).WithMany(p => p.CisternEquipments)
                .HasForeignKey(d => d.EquipmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cistern_equipment_fk_1");
        });

        modelBuilder.Entity<Debet>(entity =>
        {
            entity.HasKey(e => e.DebetId).HasName("debet_pk");

            entity.ToTable("debet");

            entity.Property(e => e.DebetId).HasColumnName("debet_id");
            entity.Property(e => e.Month).HasColumnName("month");
            entity.Property(e => e.QgPred).HasColumnName("qg_pred");
            entity.Property(e => e.QnPred).HasColumnName("qn_pred");
            entity.Property(e => e.QwPred).HasColumnName("qw_pred");
            entity.Property(e => e.SkwId).HasColumnName("skw_id");
            entity.Property(e => e.TovpId).HasColumnName("tovp_id");
            entity.Property(e => e.Year).HasColumnName("year");

            entity.HasOne(d => d.Skw).WithMany(p => p.Debets)
                .HasForeignKey(d => d.SkwId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("debet_fk");

            entity.HasOne(d => d.Tovp).WithMany(p => p.Debets)
                .HasForeignKey(d => d.TovpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("debet_fk_1");
        });

        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.HasKey(e => e.EquipmentId).HasName("equipment_pk");

            entity.ToTable("equipment", tb => tb.HasComment("Таблица Оборудование"));

            entity.Property(e => e.EquipmentId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("equipment_id");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasComment("Название оборудования")
                .HasColumnName("name");
            entity.Property(e => e.WeightKg)
                .HasComment("Вес")
                .HasColumnName("weight_kg");
        });

        modelBuilder.Entity<Guide>(entity =>
        {
            entity.HasKey(e => e.GuideId).HasName("guide_id_pk");

            entity.ToTable("guide", tb => tb.HasComment("Таблица Справочник"));

            entity.Property(e => e.GuideId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("guide_id");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Tip).HasColumnName("tip");
        });

        modelBuilder.Entity<OilProduct>(entity =>
        {
            entity.HasKey(e => e.OilProductId).HasName("oil_product_pk");

            entity.ToTable("oil_product", tb => tb.HasComment("Таблица Нефтепродукт"));

            entity.Property(e => e.OilProductId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("oil_product_id");
            entity.Property(e => e.DensityGCm3)
                .HasComment("Плотность, г/cм3")
                .HasColumnName("density_g_cm3");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasComment("Название нефтепродукта")
                .HasColumnName("name");
            entity.Property(e => e.SpeedSettlingSec)
                .HasComment("Скорость отстоя, секунды")
                .HasColumnName("speed_settling_sec");
        });

        modelBuilder.Entity<Skw>(entity =>
        {
            entity.HasKey(e => e.SkwId).HasName("skw_pk");

            entity.ToTable("skw");

            entity.Property(e => e.SkwId).HasColumnName("skw_id");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
        });

        modelBuilder.Entity<StandartSludge>(entity =>
        {
            entity.HasKey(e => e.DebetId).HasName("standart_sludge_pk");

            entity.ToTable("standart_sludge");

            entity.Property(e => e.DebetId).HasColumnName("debet_id");
            entity.Property(e => e.DevonHour)
                .HasDefaultValueSql("0")
                .HasColumnName("devon_hour");
            entity.Property(e => e.GuideId).HasColumnName("guide_id");
            entity.Property(e => e.SulfuricHour)
                .HasDefaultValueSql("0")
                .HasColumnName("sulfuric_hour");

            entity.HasOne(d => d.Guide).WithMany(p => p.StandartSludges)
                .HasForeignKey(d => d.GuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("standart_sludge_fk");
        });

        modelBuilder.Entity<Tovp>(entity =>
        {
            entity.HasKey(e => e.TovpId).HasName("tovp_pk");

            entity.ToTable("tovp");

            entity.Property(e => e.TovpId).HasColumnName("tovp_id");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

using System;
using System.Collections.Generic;

namespace BackendOfSite.EFDbCistern;

public partial class Debet
{
    public int DebetId { get; set; }

    public int SkwId { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    public decimal? QgPred { get; set; }

    public decimal? QnPred { get; set; }

    public decimal? QwPred { get; set; }

    public int TovpId { get; set; }

    public virtual Skw Skw { get; set; } = null!;

    public virtual Tovp Tovp { get; set; } = null!;
}

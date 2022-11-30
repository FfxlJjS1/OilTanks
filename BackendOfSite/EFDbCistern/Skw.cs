using System;
using System.Collections.Generic;

namespace BackendOfSite.EFDbCistern;

public partial class Skw
{
    public int SkwId { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Debet> Debets { get; } = new List<Debet>();
}

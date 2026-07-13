# Troubleshooting

During the deployment of the Veleda microservices application to Kubernetes using ArgoCD, I encountered several real-world issues that required systematic debugging. Below are the problems and how they were resolved.

## 1. ArgoCD Sync Failed

**Error**

```text
Deployment.apps "auth-service" is invalid:
spec.template.spec.containers: Required value
```

**Cause**

The Deployment manifest had incorrect YAML indentation. The `containers` section was placed outside `spec.template.spec`, making the Deployment invalid.

**Solution**

Corrected the Deployment structure by nesting `imagePullSecrets` and `containers` under `spec.template.spec`.

---

## 2. ImagePullBackOff / ErrImagePull

**Error**

```text
Failed to pull image
registry.gitlab.com/unrulybarb/veleda/auth-service:latest
```

**Cause**

The GitLab CI pipeline was pushing images tagged with commit SHAs instead of the `latest` tag, while the Kubernetes Deployment was configured to pull `latest`.

**Solution**

Updated the Kubernetes Deployment manifests to use the published commit SHA image tags from the GitLab Container Registry instead of `latest`.

---

## 3. CrashLoopBackOff

**Error**

```text
SyntaxError: Identifier 'http' has already been declared
```

**Cause**

The Node.js application accidentally declared the HTTP server twice in `index.js`.

**Solution**

Refactored the application to create only one HTTP server and consolidated all routes into a single server instance.

---

## 4. ArgoCD Repository Errors

During deployment, ArgoCD reported intermittent Redis timeout errors while attempting to generate manifests.

**Investigation**

* Verified Redis pod status.
* Confirmed Redis Service and Endpoints existed.
* Reviewed ArgoCD repository server logs.
* Observed that the issue resolved once Redis became available after the cluster restarted.

---

## 5. Kubernetes Cluster Connectivity

At one point, `kubectl` commands failed with connection errors.

**Cause**

The local Kubernetes cluster and Docker runtime were not running.

**Solution**

Restarted Docker Desktop and waited for the Kubernetes cluster to become healthy before continuing troubleshooting.

---

## Useful Debugging Commands

```bash
kubectl get pods -A
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
kubectl get deployments
kubectl get services
kubectl get endpoints
kubectl get applications -n argocd
kubectl describe application <application-name> -n argocd
kubectl get deployment <deployment-name> -o yaml
```

## Lessons Learned

* YAML indentation is critical in Kubernetes manifests.
* `kubectl describe` and `kubectl logs` are the fastest way to diagnose pod failures.
* `ImagePullBackOff` often indicates incorrect image names, tags, or registry authentication.
* Using immutable image tags (commit SHAs) makes deployments more predictable and reproducible than relying on `latest`.
* ArgoCD health and sync status provide valuable clues, but Kubernetes events and container logs reveal the underlying root cause.

This project provided hands-on experience troubleshooting Kubernetes deployments, GitOps workflows with ArgoCD, container image management using the GitLab Container Registry, and debugging Node.js applications running inside Kubernetes.
